*port_breeze_arrival
    ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]
    [chara_new name="sabrina" jname="サブリナ"]
    [chara_new name="ruria" jname="ルリア"]
    [chara_new name="hauhet" jname="ハウヘト"]

    ; フェニーは表示されている状態
    [bg storage="bgtest" time="1000"] 
    [playbgm storage="cafe" loop="true"]
    #
    君は、フェニーと共にとりま突発でポートブリーズに向かうことにした。
    [p]

    #フェニー
    サブリナにチョコを渡したくて、[br]その為の器材や材料が買いたいんだよ！[br]どっちを先に買いに行ったほうがいいかな？
    [l]

    ; 選択肢
    [link target="*buy_equipment_route" text="器材を買いに行く"]
    [link target="*buy_ingredients_route" text="材料を買いに行く"]
    [r]
    [s]


; ----- 材料ルート -----
*buy_ingredients_route
    [chara_hide name="fenny" time="200" wait="true"]
    [bg storage="bgtest2" time="1000"] 
    [chara_show name="sabrina" storage="sabrina_normal" pos="center"] 
    #サブリナ
    お、フェニー！団長と買い物？
    [p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"] 
    #フェニー
    ま、まずいんだよ！[br]サブリナにチョコを渡す計画がバレちゃうんだよ！[br]団長さん！なんとかしてぇ！
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" storage="sabrina_normal" pos="center"]
    #サブリナ
    なーにをこそこそと相談してるんだい？
    [p]
    聞かせなさい！
    [p]
    #
    このままでは計画がバレてしまう...
    [l]
    君は...
    [l]

    ; 選択肢
    [link target="*ingredients_deceive" text="ごまかす！"]
    [link target="*ingredients_leave_to_fenny_badend" text="フェニーにまかせる！"]
    [r]
    [s]

*ingredients_leave_to_fenny_badend
    [chara_hide name="sabrina" time="200" wait="true"]
    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    ふぇぇ！なんとかして欲しいのは[br]フェニーの方なんだよ！？[br]で、でも、団長さんがいうなら、[br]なんとかしてみるんだよ！
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" storage="sabrina_normal" pos="center"]
    #サブリナ
    何か悩みがあるならなんでも言って。
    [p]
    ようやく一緒にいられるんだから...
    [p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    サブリナ！[br]実はその...団長さんとデート中んだよ！
    [p]
    [chara_hide name="fenny" time="200" wait="true"]
    [stopbgm] 
    [chara_show name="sabrina" storage="sabrina_normal" pos="center"]
    #サブリナ
    は！？
    [p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    だから...その...邪魔しないで欲しいんだよ！！！
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" storage="sabrina_normal" pos="center"]
    #サブリナ
    団長...。どういうこと？[br]ちょっとあっちで"お話"しようか...
    [p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    あ、、あれ？なんか不穏なんだよ...？
    [p]
    [chara_hide name="fenny" time="200" wait="true"]
    #
    その後、君の行方を知るものは誰もいなかった...
    [p]
    ～バッドエンド～
    [l]
    [jump storage="TitleScene"]
    [s]

*ingredients_deceive
    [chara_hide name="sabrina" time="200" wait="true"]
    [bg storage="bgtest3" time="1000"] 
    なんとかサブリナをごまかし、退散することができた君たちは、カフェのキッチンでチョコの制作に取り掛かった。
    [p]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    〜♪〜♪サブリナ喜んでくれるかなぁ？
    [p]
    #
    金色に輝くボウルを混ぜながら、チョコを作るフェニー。
    [p]
    見守っていると、自然と口元が綻んでくる。
    [p]
    すると...
    [p]

    #フェニー
    ああーーーーー！！！
    [p]
    チョコが、チョコがなくなってるんだよ！！？
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="ruria" storage="ruria_normal" pos="center"]
    #ルリア
    え、ええーーー！！
    [p]
    ソ、ソンナ、イッタイダレガー！
    [p]
    #
    あからさまに動揺しているルリア。
    [p]
    まさかこれは...
    [p]
    [chara_hide name="ruria" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    ...ルリア？ルリアなんだよ？
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    ち、違います！[br]私じゃありません！話を聞いて下さい！
    [p]
    #
    どうやら証言を聞く必要があるようだ。
    [p]
    君はルリアの証言を聞くことにした。
    [p]

    ; 裁判シーンへの導入
    [playbgm storage="bgm_action" loop="true"] 
    これより議論が始まります。
    [p]
    （中略：本来は複雑なシステムですが、ここではナラティブに進行します）
    [p]
    
    #フェニー
    それは違うんだよ！！
    [p]
    フェニーが使ってたのはヒヒイロボウル！
    [p]
    ハウヘトが用意してくれた最高級品なんだよ！！
    [p]

    そ、そんな...[br]ご、ごめんなさい〜！！
    [p]

    #サブリナ
    あはは！みんなで一緒に作ろっか？
    [p]

    #フェニー
    みんなで作るんだよ！
    [p]

    #
    君は、みんなと共にチョコを作り始めた。
    [p]
    誰かを想い、誰かに想われたチョコはそこにしかない格別な味がした。
    [p]

    ～ジュウダンロンパエンド～
    [l]
    [jump storage="TitleScene"]
    [s]

; ----- 器材ルート -----
*buy_equipment_route
    [chara_hide name="fenny" time="200" wait="true"]
    [bg storage="bgtest4" time="1000"]
    君は先に器材を買いに行くことにした。
    [p]

    [chara_show name="hauhet" storage="hauhet_normal" pos="center"]
    #ハウヘト
    あら...特異点。あなたも買い物？
    [p]
    [chara_hide name="hauhet" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    ハウヘト！ハウヘトも買い物なんだよ？
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="hauhet" storage="hauhet_normal" pos="center"]
    #ハウヘト
    えぇ、ここの店はポートブリーズでも特に質が良いの。
    [p]
    この店にはよく来るから、
    [p]
    何か聞きたいことがあればアドバイスできると思うわよ？
    [p]
    [chara_hide name="hauhet" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    団長さん！
    [p]
    ハウヘトなら色々目利きが効くかもなんだよ！
    [p]
    買い物のアドバイスしてもらおう？
    [l]
    #
    ; 選択肢
    [link target="*equipment_ask_hauhet_end" text="受ける"]
    [link target="*equipment_decline" text="受けない"]
    [r]
    [s]

*equipment_ask_hauhet_end
    [chara_hide name="fenny" time="200" wait="true"]
    [chara_show name="hauhet" storage="hauhet_normal" pos="center"]
    #ハウヘト
    チョコを手作りするのね。
    [p]
    そうね、ならやはりボウルとヘラは妥協出来ないわ。
    [p]
    熱伝導効率を最大に高めるためにはこのヒヒイロボウル！
    [p]
    これは良いものよ...。
    [p]
    ヒヒイロカネはその希少性から市場にほぼ出回ることはないわ。[br]だからこそそれを贅沢に使ったこのヒヒイロボウルは...[br]（中略：ハウヘトの講釈が続く）
    [p]
    [chara_hide name="hauhet" time="200" wait="true"]
    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    なんか...すっごい早口で何言ってるか全然わかんないんだよ...
    [p]
    [chara_hide name="fenny" time="200" wait="true"]
    #
    その後、閉店時間まで延々とハウヘトの講釈を聞く羽目になった...[br]チョコ作りは当然間に合わなかった。
    [p]
    ～ハウヘトEND～
    [l]
    [jump storage="TitleScene"]
    [s]

*equipment_decline
    [bg storage="bgtest5" time="1000"]
    買い物を終えた君たちは、船内のカフェのキッチンでチョコを作り始めた。
    [p]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    〜♪〜♪サブリナ、喜んでくれるかなあ？
    [p]
    #
    鼻歌を歌いながら楽しそうにチョコを作るフェニー。
    [p]
    見ているこちらも顔が綻んでくる。
    [p]
    すると...
    [p]

    #フェニー
    ああーーーーー！！！
    [p]
    チョコが,チョコがなくなってるんだよ！！？
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="ruria" storage="roger_normal" pos="center"]
    #ルリア
    ええーーーー！！
    [p]
    ソ、ソンナ...イッタイダレガー...
    [p]
    #
    明らかに動揺しているルリア...
    [p]
    どうやら裁判が必要なようだ。
    [p]
    （中略：裁判パートを経てハッピーエンドへ）
    [p]

    #フェニー
    はい！団長さんにも！
    [p]
    ハッピーバレンタインなんだよ！
    [p]

    ～逆転追求裁判エンド～
    [l]
    [jump storage="TitleScene"]
    [s]
