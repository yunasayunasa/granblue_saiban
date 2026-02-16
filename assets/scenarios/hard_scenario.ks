; hard_scenario.ks
; ----- ハードモード登場キャラクター定義 -----


*auguste_arrival
[chara_new name="zombie" storage="zombie.png" jname="ゾンビィ"]
[chara_new name="nni" storage="nni.png" jname="ンニ"]
[chara_new name="koa" storage="koa.png" jname="アルバコア"]
[chara_new name="chocokoa" storage="chocokoa.png" jname="チョコアルバコア"]
[chara_new name="same" storage="same.png" jname="サメ"]
[chara_new name="kaki" storage="kaki.png" jname="カキフライ"]
[chara_new name="kani" storage="kani.png" jname="クァニ"]
[chara_new name="yadokari" storage="yadokari.png" jname="灼弩火罹"]
[chara_new name="katuo" storage="katuo.png" jname="カツウォヌス"]
[chara_new name="ruria" storage="ruria_normal.png" jname="ルリア"]
; ルリアの表情差分などあれば、ここに [chara_face] で追加
[chara_new name="oigen" storage="oigen_normal.png" jname="オイゲン"] 
[chara_new name="siete" storage="siete_normal.png" jname="シエテ"]
[chara_face name="siete" face="normal" storage="siete_normal.png"] 
[chara_face name="siete" face="stance" storage="siete_stance.png"] 
[chara_face name="siete" face="granchariot" storage="siete_granchariot.png"] 
; ★★★ 六竜のファイル名も _normal を付けることを推奨 ★★★
[chara_new name="wilnas" storage="wilnas_normal.png" jname="ウィルナス"]
[chara_new name="luoh" storage="luoh_normal.png" jname="ルオー"]
[chara_new name="wamdus" storage="wamdus_normal.png" jname="ワムデュス"]
[chara_new name="galleon" storage="galleon_normal.png" jname="ガレヲン"]
[chara_new name="lowain" storage="lowain_normal.png" jname="ローアイン"]
[chara_new name="narumia" storage="narumia_normal.png" jname="ナルメア"] 
  [chara_new name="siete" storage="siete_normal.png" jname="シエテ"] 
  
[chara_new name="diantha" storage="diantha_normal.png" jname="ディアンサ"]
[chara_new name="anthuria" storage="anthuria_normal.png" jname="アンスリア"]

[chara_new name="nier" storage="nier_normal.png" jname="ニーア"]
[chara_new name="sandalphon" storage="sandalphon_normal.png" jname="サンダルフォン"]
 [chara_new name="korwa" storage="korwa_normal.png" jname="コルワ"] 
[chara_new name="thug" storage="thug_normal.png" jname="荒くれ者"]
; 荒くれ者が複数いる場合、見た目が同じならこの定義を使いまわし、
; 表示位置やセリフで区別するか、あるいは thug1, thug2 のように別IDで定義しても良い
; 背景をアウギュステの街に変更 (例: data/bgimage/auguste_town.jpg を用意)
[bg storage="auguste_town.jpg" time="1000"]
[playbgm storage="cafe.mp3" loop="true"]
; このルートでは基本的に主人公一人の視点なので、特定のキャラクターを表示し続ける必要はない
#
君はアウギュステに降り立った。[p]
街はバレンタイン一色に染まり、[p]
右を見ても左を見ても、[r]
チョコを共に送り合う恋人達で溢れていた。[p]
嫉妬の炎が胸を焦がす。[r]
このままではこの炎は頭の中までも焦がし、君は狂ってしまうだろう。[p]

君は...[l]

; 選択肢
[glink  text="海までダッシュ！" target="*dash_to_sea"]
[glink  text="無心で買い物へ" target="*shopping_mindlessly_badend"]
[glink  text="船に戻る" target="*return_to_ship_badend"]
[s]

*return_to_ship_badend 
    ; [playse storage="select_se.wav"]
    [bg storage="ship_interior.jpg" time="500"]
    君は船に戻った。[p]
    ムードに気圧され、圧倒された。[p]
    自分の情けなさに嫌気がさし、[p]
    君は膝を抱えたまま、眠りに落ちた。[p]
    BAD END [l]
    [jump storage="first.ks" target="*start"] 

*shopping_mindlessly_badend 
    ; [playse storage="select_se.wav"]
     ; ★★★ 背景をカフェに変更 (流用) ★★★
    [bg storage="cafe_bg.jpg" time="500"]
    君は無心で買い物へ出かけた。[p]

    「ねぇ、まりっぺ！これ美味しそう！」[p]
    「メグ...！これってカップル専用の...！[r]
    そんなに私の事を...！」[p]
    「ジュリエット、君にこのチョコ指輪を贈らせてくれ！」[p]
    「ロミオ...！」[p]

    無心、無心、無━[p]
    無理だ、こんな雰囲気の中で[r]
    正気を保てる訳がない。[p]
    君は叫んだ、心の底から、[r]
    全ての鬱憤を吐き出す様に━[p]

    誰かが、肩に手を置いた。[p]
    「事案ですか？」[p]
    BAD END [l]
    [jump storage="first.ks" target="*start"]

*dash_to_sea 
    ; [playse storage="select_se.wav"]

  

    君は海まで走った。[p]
    周りに目もくれず、ひた走る。[p]
    海に着いた君は、剣を振りつづけていた。[p]
    999回、1000回━[p]
    無心で素振りを続けた結果、[r]
    君の素振りは、音を置き去りにしていた。[l]

   



    そんな君の前に現れたのは...[l]

    ; 次の選択肢
    [glink  text="荒くれ者達" target="*thugs_appear_badend_hard"] 
    [glink  text="海のトンチキ生物達" target="*sea_creatures_appear_hard"]
    [glink  text="ローアイン達" target="*lowain_appear_badend_hard"]
    [s]

*thugs_appear_badend_hard 
    ; [playse storage="select_se.wav"]
    ; 背景は海のまま

    君の前に現れたのは荒くれ者達だった。[p]

    ; 荒くれ者を表示
    [chara_show name="thug" x="150" y="150" time="500" wait="true"] 
    #荒くれ者
    こんなとこで剣なんか振ってんじゃねえよ！[r]
    あぶねえだろうが！[p]
    [chara_hide name="thug" time="300" wait="true"]
#
    ...正論を振りかざされ、君は心が折れた。[p]
    BAD END [l]
    [jump storage="first.ks" target="*start"]

*lowain_appear_badend_hard 
    ; [playse storage="select_se.wav"]
    ; 背景は海のまま
#
    君の前に現れたのはローアイン達だった。[p]

    ; ローアインを表示 (エルセムとトモイは出さないのでローアインのみ)
    [chara_show name="lowain" x="150" y="150" time="500" wait="true"]
    #ローアイン
    あれ？ﾀﾞﾝﾁｮ？[r]
    こんなとこで剣なんか振っちゃってDoしたん？[p]
    ; トモイのセリフ (ローアインが代弁するか、地の文で)
     #トモイ
     「俺たち今からそこの海の家でダベるんすよ。ﾀﾞﾝﾁｮもDoすか？」[p]
    ; エルセムのセリフ
    #エルセム
    「一緒にグラブっちゃいまっしょ！フワッフワッ！」[p]
    ;もしローアインが全部言うなら上記のように。地の文で補足も可。
    ; ここでは台本通り、各キャラが言っている体で進めます（立ち絵はローアインのみ）
    

#
    君はローアイン達と海の家でダベることにした。[p]
    妄想トークが捗り、[r]
    非常に楽しい1日を過ごした━[p]

    [chara_hide name="lowain" time="300" wait="true"]
    ; ロジャー登場
    [chara_show name="roger" x="150" y="150" time="500" wait="true"]
    #ロジャー
    ちょちょちょい！待って！[r]
    チョコ忘れてない！？再演算！[p]
    [chara_hide name="roger" time="300" wait="true"]
    #
    BAD END[l]
    [jump storage="first.ks" target="*start"]

*sea_creatures_appear_hard 
    [playbgm storage="battle.mp3" loop="true"]
    ; 背景は海のまま
    ; ここではまだキャラクターは表示しない（地の文で進行）

    君の前に現れたのは、海のトンチキ生物達だった。[p]
    [chara_show name="kaki" x="150" y="150" time="500" wait="true"]
    カキフライ「━━━━！」[p]
[chara_hide name="kaki" time="300" wait="true"]
    [chara_show name="nni" x="150" y="150" time="500" wait="true"]
    ンニ「━━━━━！！！」[p]
[chara_hide name="nni" time="300" wait="true"]
    [chara_show name="katuo" x="150" y="150" time="500" wait="true"]
    カツウォヌス「━━━━━━━！！！！！」[p]
[chara_hide name="katuo" time="300" wait="true"]
    前から後ろから、左右から、[r]
    海の生物が襲いかかる。[l]
    どれから対処すべきか...[l]

    ; 次の選択肢
    [glink  text="ンニ" target="*failed_battle_badend"] 
    [glink  text="カツウォヌス" target="*progress_battle_1"] 
    [glink  text="カキフライ" target="*failed_battle_badend"] 
    [s]

*failed_battle_badend 
 [stopbgm] 
    ; [playse storage="select_se.wav"]
    ; 背景は海のままか、自室の背景に変更するか
    [bg storage="my_room_bg.jpg" time="500"] 
#
    君は目を覚ました。[p]
    見知った天井、自分の部屋だ。[p]

    ; ルリア登場
    [chara_show name="ruria" x="150" y="150" time="500" wait="true"]
    #ルリア
    大丈夫ですか？[r]
    今、ティコさんを呼んできますね！[p]
    [chara_hide name="ruria" time="300" wait="true"]
#
    どうやら選択を誤ったらしい。[p]
    全身の痛みに生を実感しながら、[p]
    君は、目を閉じた。[p]
    BAD END [l]
    [jump storage="first.ks" target="*start"]


*progress_battle_1 
    ; [playse storage="select_se.wav"]
    ; 背景は海のまま
[chara_show name="kaki" x="150" y="150" time="500" wait="true"]
 [quake time="500" count="3" hmax="15" vmax="15" wait="false"] 
  [playse storage="smash.mp3" stop="false"]
    カキフライ「━━━━！？」[p] 
    [chara_hide name="kaki" time="300" wait="true"]
    まずは1つ、次は━[p]
    [chara_show name="same" x="150" y="150" time="500" wait="true"]
    サメ「━━━！」[p]
     [chara_hide name="same" time="300" wait="true"]
     [chara_show name="koa" x="150" y="150" time="500" wait="true"]
    アルバコア「━━━━！！！」[p]
     [chara_hide name="koa" time="300" wait="true"]
    #
    増援。君は選択を迫られる...[l]

    ; 次の選択肢
    [glink  text="ンナギ" target="*final_battle_badend"]
    [glink  text="ンニ" target="*final_battle_badend"]
    [glink  text="アルバコア" target="*final_battle_badend"]
    [glink  text="煉獄カツウォヌス" target="*final_battle_badend"] 
    [s]

*final_battle_badend
    ; [playse storage="select_se.wav"]
    ; 背景は海のまま
 [chara_show name="kani" x="150" y="150" time="500" wait="true"]
    クァニ「━━━━！！」[p]
  [chara_hide name="kani" time="300" wait="true"]
     [chara_show name="yadokari" x="150" y="150" time="500" wait="true"]
    灼弩火罹「━━！」[p]
  [chara_hide name="yadokari" time="300" wait="true"]
     [chara_show name="zombie" x="150" y="150" time="500" wait="true"]
    #ゾンビィ
    「ドライブイン！とっ！りっ！」[p] 
  [chara_hide name="zombie" time="300" wait="true"]
    #
    更に増えるトンチキ生物達。[p]
    無理だ。1人では━[p]
    君は押し迫る海の生物達の中に消えていった...。[p]
 [stopbgm] 
    ; ★★★ ここで「再演算する」か「タイトルに戻る」の選択肢 ★★★
    ; 台本ではリンクになっているが、ゲームの選択肢として実装
    [glink  text="再演算する" target="*pseudo_prologue_start"] 
    [glink  text="あきらめる" storage="first.ks" target="*start"]
    [s]

*pseudo_prologue_start
    [cm]
    [clearfix]
    [playbgm storage="enzan.mp3" loop="true"] 
    [bg storage="calc_space.jpg" time="1000"]

    ; メッセージウィンドウ等も first.ks と同様に設定
    [position layer="message0" left="25" top="600" width="400" height="180" page=fore visible=true]
    [position layer="message0" page=fore margint="25" marginl="25" marginr="25" marginb="25"]
    [ptext name="chara_name_area" layer="message0" color="white" size="20" bold="true" x="40" y="605" visible="false"]
    [chara_config ptext="chara_name_area"]

    ; キャラクター定義は事前に済んでいる想定
#
    君は、どこか見覚えのある空間にいる。[r]
    幻想的な一面の花畑、[r]
    やはり現実とは思えない。[p]

   


    [chara_show name="roger" x="200" y="150"]
    #ロジャー
おはよう！お呼びとあらば即参上できない！[r]
今日も今日とて限界勤務上等の[r]
オロロジャイアちゃんでっす！[p]

ｵﾎﾝｴﾍﾝ...!ここは演算世界。[r]
僕の力で作り出された世界。[r]
あらゆる可能性を探るための場所さ。[p]

これから君には僕と一緒に[r]
旅をしてもらいたいんだ。[p]
そう！君がチョコをもらえる世界を[r]
探り出す為に！[p]
そんな訳で早速行ってみよう〜！[r]
と言っても...僕は一緒に行ける訳ではないんだけどね！[r]
社畜の悲しみ！[p]
代わりにガチャ回させてあげるから許して！[p]
はい！10連ガチャガチャっとね！[p]

; ロジャー退場
[chara_hide name="roger" time="500" wait="true"]

; ガチャ演出 (今は省略、SEや簡単なアニメーションを入れることも可能)

#
1人の仲間が目の前に現れる。[p]



#？？？
それじゃあ、団長ちゃん、一緒に行こっか♪[p]

    仲間になったのは...[l]

    ; 選択肢 (通常のプロローグと同じものを表示)
    [glink  text="ナルメア" target="*pseudo_select_narumia_true_route"]
    [glink  text="シエテ" target="*pseudo_select_siete_loop"]
    [glink  text="誰も仲間にしない" target="*pseudo_select_hard_loop"]
    [s]

*pseudo_select_narumia_true_route
    ; [playse storage="select_se.wav"]
    [eval exp="f.true_ending_route_flag = true"]

    ; ナルメアとシエテが登場する展開へ
    [chara_show name="narumia" x="50" y="150" time="500" wait="true"]
    
    #ナルメア
    ...どうしてあなたもいるのかな？[r]
    団長ちゃんのお願いは、私だけだったはずだけど？[p]
    [chara_hide name="narumia" time="200" wait="true"]
[chara_show name="siete" x="250" y="150" time="500" wait="true"]

    #シエテ
    まぁまぁ、そう硬いこと言わないで。[r]
    団長ちゃんには俺たちの両方の力が必要みたいだからね。[p]
     [chara_hide name="siete" time="200" wait="true"]
#ナルメア、シエテ
    「「それじゃあ、一緒に行こっか、団長ちゃん！」」[p]
#
    君は海へ向かった━[l]
    [jump target="*true_route_sea_battle_start"] 

*pseudo_select_siete_loop
    ; [playse storage="select_se.wav"]
    [jump storage="siete_scenario.ks" target="*deck_scene_start"]

*pseudo_select_hard_loop 
    ; [playse storage="select_se.wav"]
    [jump storage="hard_scenario.ks" target="*auguste_arrival"] 


; ----- 本当のエンディングルートの戦闘開始 -----
*true_route_sea_battle_start
   [bg storage="auguste_town.jpg" time="1000"]
   [playbgm storage="battle.mp3" loop="true"]
    ; ナルメアとシエテは表示されたまま
#
    海に着いた君たちの前に現れたのは、[r]
    海のトンチキ生物達だった。[p]
    
    [chara_show name="kaki" x="150" y="150" time="500" wait="true"]
     [quake time="500" count="3" hmax="15" vmax="15" wait="false"]
    カキフライ「━━━━！」[p]
[chara_hide name="kaki" time="300" wait="true"]
    [chara_show name="nni" x="150" y="150" time="500" wait="true"]
    ンニ「━━━━━！！！」[p]
[chara_hide name="nni" time="300" wait="true"]
    [chara_show name="katuo" x="150" y="150" time="500" wait="true"]
    カツウォヌス「━━━━━━━！！！！！」[p]
[chara_hide name="katuo" time="300" wait="true"]
#
    前から後ろから、左右から、[r]
    海の生物が襲いかかる。[p]
    どれから対処すべきか...[l]

    ; 選択肢 (ここもどれを選んでもOK？それとも正解がある？台本からは判断難しい)
    ; ここでは仮にどれを選んでも次の展開に進むようにします
    [glink  text="ンニ" target="*true_route_battle_progress_1"]
    [glink  text="カツウォヌス" target="*true_route_battle_progress_1"]
    [glink  text="カキフライ" target="*true_route_battle_progress_1"]
    [s]

*true_route_battle_progress_1
    ; [playse storage="select_se.wav"]
  [chara_show name="kaki" x="150" y="150" time="500" wait="true"]
     [quake time="500" count="3" hmax="15" vmax="15" wait="false"]
      [playse storage="smash.mp3" stop="false"]
    カキフライ「━━━━！？」[p]
[chara_hide name="kaki" time="300" wait="true"]
[chara_show name="siete" x="250" y="150" time="500" wait="true"]
    #シエテ
    左右は任せて！[p] 
 [chara_hide name="siete" time="200" wait="true"]
  [chara_show name="narumia" x="50" y="150" time="500" wait="true"]
    #ナルメア
    うん！団長ちゃんは正面に集中して！[p]
 [chara_hide name="narumia" time="200" wait="true"]
    #
    [chara_show name="same" x="150" y="150" time="500" wait="true"]
    サメ「━━━！」[p]
     [chara_hide name="same" time="300" wait="true"]
     [chara_show name="koa" x="150" y="150" time="500" wait="true"]
    アルバコア「━━━━！！！」[p]
     [chara_hide name="koa" time="300" wait="true"]
    増援。君は選択を迫られる...[l]

    ; 次の選択肢 (ここもどれを選んでもOKか？)
    [glink  text="ンナギ" target="*true_route_final_battle"]
    [glink  text="ンニ" target="*true_route_final_battle"]
    [glink  text="アルバコア" target="*true_route_final_battle"]
    [glink  text="カツウォヌス" target="*true_route_final_battle"]
    [s]

*true_route_final_battle
    ; [playse storage="select_se.wav"]

    [chara_show name="kani" x="150" y="150" time="500" wait="true"]
    クァニ「━━━━！！」[p]
  [chara_hide name="kani" time="300" wait="true"]
     [chara_show name="yadokari" x="150" y="150" time="500" wait="true"]
    灼弩火罹「━━！」[p]
  [chara_hide name="yadokari" time="300" wait="true"]
     [chara_show name="zombie" x="150" y="150" time="500" wait="true"]
    #ゾンビィ
    「おっはよーございまーす！[p]
  [chara_hide name="zombie" time="300" wait="true"]
   
#
    更に増えるトンチキ生物達。[p]
    無理だ。1人では━[p]
    「でも今は...！」[p]

     ; --- カットイン開始 ---
    ; 表示するキャラクターのリスト (表示したい順に)
     [eval exp="tf.cutin_chars = ['roger', 'narumia', 'siete', 'sandalphon', 'diantha', 'anthuria', 'nier',  'oigen', 'wilnas', 'luoh', 'wamdus', 'galleon', 'lowain', 'thug']"]
     [eval exp="tf.cutin_chars.push('ruria')"]
  ; 表示位置やエフェクトは共通化も可能
    ; ここではシンプルに中央に表示して消す例

   [iscript]
tf.cutin_characters = ["roger", "narumia", "siete", "sandalphon", "diantha","anthuria","nier","oigen","wilnas","luoh","wamdus","galleon","lowain","thug", ];
tf.cutin_index = 0;
[endscript]

*cutin_loop
[iscript]
if (tf.cutin_index < tf.cutin_characters.length) {
    var chara_id = tf.cutin_characters[tf.cutin_index];
    // ここで [chara_show] に相当する処理をJavaScriptで書くか、
    // あるいは f変数にキャラIDをセットしてタグで呼び出す
    TYRANO.kag.ftag.startTag("chara_show", { name: chara_id, x:"150", y:"150", time:"50", wait:"false" });
}
[endscript]
[wait time="100"]
[iscript]
if (tf.cutin_index < tf.cutin_characters.length) {
    var chara_id = tf.cutin_characters[tf.cutin_index];
    TYRANO.kag.ftag.startTag("chara_hide", { name: chara_id, time:"50", wait:"false" });
    tf.cutin_index++;
}
[endscript]
[wait time="50"]
[jump target="*cutin_loop" cond="tf.cutin_index < tf.cutin_characters.length"]

; ループ終了後、ルリア表示
[chara_show name="ruria" x="150" y="150" time="200" wait="true"]
[wait time="800"]
 [playse storage="smash.mp3" stop="false"]
    「1人じゃない！」[p]
[chara_hide name="ruria" time="200" wait="true"]
    ; ここで仲間たちの攻撃演出 (SEや短いエフェクトなど)
   
  [chara_show name="oigen" x="50" y="150" time="500" wait="true"]
   [quake time="500" count="3" hmax="15" vmax="15" wait="false"]
   #三羽烏
    「「「ソイヤッ！」」」[p]
     [chara_hide name="oigen" time="200" wait="true"]
   #
   カツウォヌスが捌かれる━[p]
     [chara_show name="wilnas" x="50" y="150" time="500" wait="true"]
    #ウィルナス
    「殲滅、殲滅！」[p]
    [chara_hide name="wilnas" time="200" wait="true"]
    [chara_show name="wamdus" x="50" y="150" time="500" wait="true"]
    #ワムデュス
    「ワム、お腹すいた...全部食べる。」[p]
     [chara_hide name="wamdus" time="200" wait="true"]
    ンニが、ンナギが、ゾンビが、[p]
    [chara_show name="sandalphon" x="50" y="150" time="500" wait="true"]
    #サンダルフォン
    「アイン•ソフ•オウル！」[p]
     [playse storage="smash.mp3" stop="false"]
     [chara_hide name="sandalphon" time="200" wait="true"]
#
    殆どの海の生物達が彼らの前に倒れた。[p]
    残すは━[p]

    [chara_hide name="nni" time="300" wait="true"]
    [chara_show name="chocokoa" x="150" y="150" time="500" wait="true"]
    

     [quake time="500" count="3" hmax="15" vmax="15" wait="false"]
    チョコ•アルバコア「チョコオオオオオオオオオオオオ━━━！！」[p] 
[chara_hide name="chocokoa" time="300" wait="true"]
    ; ルリア登場
    [chara_hide name="narumia" time="100" wait="false"] 
    [chara_hide name="siete" time="100" wait="true"]
    [chara_show name="ruria" x="150" y="150" time="500" wait="true"]
    #ルリア
    ...！目の中にもう一つ星晶獣の気配を感じます！[l]
    [chara_hide name="ruria" time="200" wait="true"]
#
    最後の選択だ、君は...[l]

    ; 最後の選択肢
    [glink color="green"  size="28" text="目を狙う" target="*true_ending"] 
    [glink color="red"  size="28" text="ヒレを狙う" target="*failed_battle_badend"] 
    [s]

    *hard_mode_start
    ; ハードモード開始時の初期処理 (もしあれば)
    ; 例えば、特定のフラグを立てるなど
    ; [eval exp="f.hard_mode = true"]
    [chara_show name="roger" x="200" y="150"]
    #ロジャー
    え！？誰もいらない！？[p] 
    まぁ、君がそういうなら…[r]
    …その先は地獄だよ？[p]
    [chara_hide name="roger" time="500" wait="true"]
    
    [jump storage="hard_scenario.ks" target="*auguste_arrival"]

*true_ending 
    ; [playse storage="select_se.wav"]
    [cm]
    [clearfix]
    [playbgm storage="ending_bgm.mp3" loop="true"]

    ; ルリア登場
    [chara_show name="ruria" x="150" y="150" time="1000" wait="true"]
    #ルリア
    チョコを司る星晶獣なんて、[r]
    びっくりです〜！あむっ！[p]
#
    チョコ味になったアルバコアの甘さに頬を緩めながら、[r]
    ルリアは言う。[p]
    アウギュステ全体に漂うバレンタインムードは、[r]
    チョコの星晶獣「チョコアニィサキウス」の仕業だった。[p]
    その甘い香りを嗅いだものは、[r]
    無性に甘い気分になるのだ。[p]

    #ルリア
    そうそう！ずっとあなたを探してたんです！[r]
    これ、どうぞ！[p]
#
    ルリアの手から、丁寧に包装された包みが渡された。[p]

    #ルリア
    ハッピーバレンタイン♪[r]
    これからもよろしくお願いしますね！[p]
    [chara_hide name="ruria" time="300" wait="true"]
#
    ～HAPPY END～[p]

    ; ロジャーとコルワのセリフ (立ち絵を表示するか、名前表示のみか)
     [chara_show name="roger" x="40" y="150"]
    
    
    #ロジャー
    うんうん、やっぱり最後は[r]
     [chara_hide name="roger" time="500" wait="true"]
     [chara_show name="korwa" x="300" y="150"]
     #コルワ
    ハッピーエンドよね！[p]
     [chara_hide name="korwa" time="500" wait="true"]
    #
   

    ゲームブック[r]
    【演算世界とチヨコレイト】[r]
    〜完〜[l]


    
    

    ; ★★★ ハードモードクリアフラグを立てる ★★★
    [eval exp="sf.hard_mode_cleared = true"]

    ハードモードをクリアしました。[p]
    追加ルートを開放します。[p]
    ここでセーブを推奨します。[l][p]
    
    [jump storage="first.ks" target="*start"] ; 最初のシナリオへ
